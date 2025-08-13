{
  buildNpmPackage,
  node-pre-gyp,
  python3,
  libpq,
  which,
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
  npmDepsHash = "sha256-GhHhGVxcSwNyDoVdThr5CNOClp54Md4r8g476LRwyZg=";

  nativeBuildInputs = [
    node-pre-gyp
    python3
    libpq.pg_config
    which
  ];

  buildInputs = [
    libpq
  ];

  makeWrapperArgs = [
    "--set-default FRONTEND_PATH ${frontend}"
  ];

  postInstall = ''
    mv $out/bin/backend $out/bin/isopistekortti
  '';

  meta.mainProgram = "isopistekortti";
}
