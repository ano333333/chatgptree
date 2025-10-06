{
  pkgs,
  ...
}: {
  projectRootFile = "./flake.nix";

  programs = {
    biome = {
      enable = true;
      package = pkgs.biome;
      includes = [
        "src/**/*.ts"
        "src/**/*.tsx"
        "src/**/*.css"
        "src/**/*.json"
        "tests/**/*.ts"
        "tests/**/*.tsx"
        "vite.config.ts"
      ];
      settings = import ./biome.treefmt.nix;
    };

    prettier = {
      enable = true;
      excludes = [
        "**/*.{js,jsx,ts,tsx,json,css}"
        "vite.config.ts"
      ];
      settings = import ./prettier.treefmt.nix;
    };
  };

  settings = {
    global.excludes = [
      ".cursor/**"
      ".direnv/**"
      ".git/**"
      "coverage/**"
      "dist/**"
      "node_modules/**"
    ];

    formatter = {
      biome = {
        options = [ "check" "--apply" "--no-errors-on-unmatched" ];
      };
    };
  };
}