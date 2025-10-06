{
  pkgs,
  ...
}: {
  projectRootFile = "flake.nix";

  programs = {
    biome = {
      enable = true;
      package = pkgs.biome;
      includes = [
        "**/*.{js,jsx,ts,tsx,json,css}"
      ];
    };

    prettier = {
      enable = true;
      excludes = [
        "**/*.{js,jsx,ts,tsx,json,css}"
        "vite.config.ts"
      ];
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