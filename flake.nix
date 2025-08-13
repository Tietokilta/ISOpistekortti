{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    {
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
        rec {
          isopistekortti = pkgs.callPackage ./package.nix { };
          docker = pkgs.dockerTools.buildLayeredImage {
            name = "isopistekortti";
            tag = "latest";
            contents = [ pkgs.cacert ];
            config.Cmd = [ "${lib.getExe isopistekortti}" ];
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

            # Needed to install pg-native
            python3
            libpq.pg_config
          ];
        }
      );
    };

}
