{
  buildNpmPackage,
  node-pre-gyp,
}:
let
  frontend = buildNpmPackage {
    name = "isopistekortti-frontend";
    src = ./frontend;
    npmDepsHash = "sha256-7kcYh3dtH1TFaQFxN1njoASjsCt/eTq0aA1d3Xe2s20=";

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
  npmDepsHash = "sha256-0J9g1Dl3N+0iBi8i6DioWC1bh40vqrZpk1DlDbwFvFE=";

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
