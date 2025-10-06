{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };

  outputs = {
    self,
    nixpkgs,
  }:
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
      config.allowUnfree = true;
    };
    builtinExts = with pkgs.vscode-extensions; [
      biomejs.biome
      esbenp.prettier-vscode
    ];
    vscode = pkgs.vscode-with-extensions.override {
      vscodeExtensions = builtinExts;
    };
  in
  {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [
        nodejs_24
        nodePackages.pnpm
        vscode
      ];
      shellHook = ''
        echo "entered devShell"
      '';
    };
  };
}