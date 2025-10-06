{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };

  outputs = {
    self,
    nixpkgs,
    treefmt-nix,
  }:
  let
    systems = [ "x86_64-linux" "aarch64-darwin" ];
    gen = nixpkgs.lib.genAttrs;
  in
  {
    devShells = gen systems (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_24
            nodePackages.pnpm
            playwright-driver.browsers
          ];
          shellHook = ''
            echo "entered devShell"

            export PATH="node_modules/.bin:$PATH"

            # playwrightにNixのパスを渡す
            export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
            export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
            export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true
          '';
        };
      }
    );

    formatter = gen systems (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      (treefmt-nix.lib.evalModule pkgs ./treefmt-nix/treefmt.nix).config.build.wrapper
    );
  };
}
