{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    {
      self,
      nixpkgs,
      ...
    }@inputs:
    let
      lib = nixpkgs.lib;
      forAllSystems = lib.genAttrs [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
    in
    {
      packages = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = self.packages.${system}.isopistekortti;
          isopistekortti = pkgs.callPackage ./package.nix { };
          docker = pkgs.dockerTools.buildLayeredImage {
            name = "isopistekortti";
            tag = "latest";

            config = {
              Cmd = [ "${lib.getExe self.packages.${system}.isopistekortti}" ];
              Env = [
                "PGSSLROOTCERT=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
              ];
            };
          };
        }
      );

      devShell = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        pkgs.mkShellNoCC {
          packages = with pkgs; [
            nodejs
          ];
        }
      );
    };

}
