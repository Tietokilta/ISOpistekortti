{
  buildNpmPackage,
  node-pre-gyp,
}:
let
  frontend = buildNpmPackage {
    name = "isopistekortti-frontend";
    src = ./frontend;
    npmDepsHash = "sha256-WIu8ZykkdkCfBuyAFyhr8ato6P8NNUmyo5asI60pDU0=";

    installPhase = ''
      runHook preInstall

      cp -r dist/ $out/

      runHook postInstall
    '';
  };
in
buildNpmPackage {
  name = "isopistekortti";
  src = ./backend;
  npmDepsHash = "sha256-e7/umMywjHVULiRv6Rojd2mL4RIOPfBTePn0zRNJ+14=";

  nativeBuildInputs = [
    node-pre-gyp
  ];

  makeWrapperArgs = [
    "--set-default FRONTEND_PATH ${frontend}"
  ];

  postInstall = ''
    mv $out/bin/backend $out/bin/isopistekortti
  '';

  meta.mainProgram = "isopistekortti";
}
