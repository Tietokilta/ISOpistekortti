{
  inputs = {
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
    devenv.inputs.nixpkgs.follows = "nixpkgs";
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = { self, nixpkgs, devenv, systems, ... } @ inputs:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      packages = forEachSystem (system: let
          pkgs = nixpkgs.legacyPackages.${system};
          lib = pkgs.lib;
        in rec {
          isopistekortti = pkgs.callPackage ./package.nix { };
          docker = pkgs.dockerTools.buildLayeredImage {
            name = "isopistekortti";
            tag = "latest";
            config.Cmd = ["${lib.getExe isopistekortti}"];
          };

          devenv-up = self.devShells.${system}.default.config.procfileScript;
          devenv-test = self.devShells.${system}.default.config.test;
        });

      devShells = forEachSystem
        (system:
          let
            pkgs = nixpkgs.legacyPackages.${system};
          in
          {
            default = devenv.lib.mkShell {
              inherit inputs pkgs;
              modules = [
                {
                  languages.javascript = {
                    enable = true;
                    npm.enable = true;
                  };
                }

                {
                  processes = {
                    postgres.exec = "cd backend && npm run db:start";
                    backend.exec = "cd backend && npm run dev";
                    frontend.exec = "cd frontend && npm run dev";
                  };

                  process.managers.process-compose.settings.processes = {
                    postgres = {
                      readiness_probe = {
                        exec.command = "cd backend && docker compose exec postgres pg_isready -d ${builtins.getEnv "DB_DATABASE"} -U ${builtins.getEnv "DB_USER"}";
                        initial_delay_seconds = 3;
                        failure_thresholds = 3;
                      };
                    };

                    backend = {
                      depends_on.postgres.condition = "process_healthy";
                    };
                  };
                }
              ];
            };
          });
    };
}
