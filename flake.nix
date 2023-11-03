{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs, flake-utils, }: flake-utils.lib.eachDefaultSystem (system: {
    devShells.default = with import nixpkgs { inherit system; }; mkShell {
      buildInputs = [ prisma-engines openssl ];
      shellHook = ''
        export PRISMA_SCHEMA_ENGINE_BINARY="${prisma-engines}/bin/schema-engine"
        export PRISMA_QUERY_ENGINE_BINARY="${prisma-engines}/bin/query-engine"
        export PRISMA_FMT_BINARY="${prisma-engines}/bin/prisma-fmt"
        export PRISMA_QUERY_ENGINE_LIBRARY="${prisma-engines}/lib/libquery_engine.node"
      '';
    };
  });
}
