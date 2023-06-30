/**
 * @fileoverview -
 * @author Birzhan
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/import"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: "module"
  }
});

ruleTester.run("import", rule, {
  valid: [
    {
      name: "05",
      only: true,
      code: "import { ClientBus, subscribe } from \"@yandex-nirvana/bus\";\n" +
        "\n" +
        "import { call } from \"typed-redux-saga\";\n" +
        "\n" +
        "import {selectDeliveryDate} from '../../selectors';\n" +
        "\n" +
        "import {calcDeliveryDate} from './helpers';",
    }
  ],

  invalid: [
    {
      name: "01",
      only: true,

      code: "import fs from 'fs';\n" +
        "import path from 'path';\n" +
        "\n" +
        "import _ from 'lodash';",

      output: "import fs from 'fs';\n" +
        "import _ from 'lodash';\n" +
        "import path from 'path';",

      errors: 1
    },

    {
      name: "02",
      only: true,

      code: "import type {ExperimentFlag} from '.';\n" +
        "import {selectDeliveryDate} from '../../selectors';",

      output: "import {selectDeliveryDate} from '../../selectors';\n" +
        "\n" +
        "import type {ExperimentFlag} from '.';",

      errors: 1
    },

    {
      name: "03",
      only: true,

      code: "import {selectDeliveryDate} from '../../selectors';\n" +
        "import {calcDeliveryDate} from './helpers';\n" +
        "import type {ExperimentFlag} from '.';",

      output: "import {selectDeliveryDate} from '../../selectors';\n" +
        "\n" +
        "import type {ExperimentFlag} from '.';\n" +
        "import {calcDeliveryDate} from './helpers';",

      errors: 1
    },

    {
      name: "04",
      errors: 1,
      only: true,

      code: "import { call } from \"typed-redux-saga\";\n" +
        "import { ClientBus, subscribe } from \"@yandex-nirvana/bus\";",

      output: "import { ClientBus, subscribe } from \"@yandex-nirvana/bus\";\n" +
        "\n" +
        "import { call } from \"typed-redux-saga\";"
    },

    {
      name: "06",
      errors: 1,
      only: true,

      code: "import { pluralize } from \"../../../../lib/utils\";\n" +
        "\n" +
        "import { call } from \"typed-redux-saga\";",

      output: "import { call } from \"typed-redux-saga\";\n" +
        "\n" +
        "import { pluralize } from \"../../../../lib/utils\";"
    },

    {
      name: "07",
      errors: 1,
      only: true,

      code: "import fs from 'fs';\n" +
        "const dynamic = import(\"my-dynamic-import\");\n" +
        "import _ from 'lodash';\n" +
        "import path from 'path';",

      output: "import fs from 'fs';\n" +
        "import _ from 'lodash';\n" +
        "import path from 'path';\n" +
        "\n" +
        "const dynamic = import(\"my-dynamic-import\");"
    },

    {
      name: "08",
      errors: 1,
      only: true,

      code: "import {pluralize} from \"../../../../lib/utils\";\n" +
        "import {calcDeliveryDate} from './helpers';\n" +
        "import {defaultConfig} from \"@shri2023/config\";\n" +
        "import _ from 'lodash';",

      output: "import {defaultConfig} from \"@shri2023/config\";\n" +
        "\n" +
        "import _ from 'lodash';\n" +
        "\n" +
        "import {pluralize} from \"../../../../lib/utils\";\n" +
        "\n" +
        "import {calcDeliveryDate} from './helpers';"
    },

    {
      name: "09",
      errors: 1,
      only: true,

      code: "import {hermione} from \"@yandex\";\n" +
        "import {solutions} from \"@shri2023/solutions\";\n" +
        "import {serviceSlug} from \"@abc\";",

      output: "import {serviceSlug} from \"@abc\";\n" +
        "import {solutions} from \"@shri2023/solutions\";\n" +
        "import {hermione} from \"@yandex\";"
    },

    {
      name: "10",
      errors: 1,
      only: true,

      code: "import {relative} from \"../../relative-package\";\n" +
        "\n" +
        "// This module is imported for commons good\n" +
        "import * as lodash from \"lodash\";",

      output: "// This module is imported for commons good\n" +
        "import * as lodash from \"lodash\";\n" +
        "\n" +
        "import {relative} from \"../../relative-package\";"
    },

    {
      name: "11",
      errors: 1,
      only: true,

      code: "import {relative} from \"../../relative-package\";\n" +
        "\n" +
        "/**\n" +
        " * This module is imported\n" +
        " * for commons good\n" +
        " */\n" +
        "import * as lodash from \"lodash\";",

      output: "/**\n" +
        " * This module is imported\n" +
        " * for commons good\n" +
        " */\n" +
        "import * as lodash from \"lodash\";\n" +
        "\n" +
        "import {relative} from \"../../relative-package\";"
    },

    {
      name: "12",
      errors: 1,
      only: true,

      code: "// This module is imported for commons good\n" +
        "// This module is imported for commons good\n" +
        "// This module is imported for commons good\n" +
        "import {relative} from \"../../relative-package\";\n" +
        "import * as lodash from \"lodash\";",

      output: "import * as lodash from \"lodash\";\n" +
        "\n" +
        "// This module is imported for commons good\n" +
        "// This module is imported for commons good\n" +
        "// This module is imported for commons good\n" +
        "import {relative} from \"../../relative-package\";"
    },

    {
      name: "13",
      errors: 1,
      only: true,

      code: "import _ from 'lodash';\n" +
        "\n" +
        "import fs from 'fs';\n" +
        "\n" +
        "import path from 'path';\n" +
        "\n" +
        "if(true) {\n" +
        "  const dynamic = import(\"my-dynamic-import\");\n" +
        "  const dynamic2 = import(\"my-dynamic-import2\");\n" +
        "}\n",

      output: "import fs from 'fs';\n" +
        "import _ from 'lodash';\n" +
        "import path from 'path';\n" +
        "\n" +
        "if(true) {\n" +
        "  const dynamic = import(\"my-dynamic-import\");\n" +
        "  const dynamic2 = import(\"my-dynamic-import2\");\n" +
        "}\n"
    },

    {
      name: "14",
      errors: 1,
      only: true,

      code: "import _ from 'lodash';\n" +
        "\n" +
        "import fs from 'fs';\n" +
        "\n" +
        "import path from 'path';\n" +
        "\n" +
        "async function test() {\n" +
        "  if(true) {\n" +
        "    const dynamic = await import(\"b\");\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "async function main() {\n" +
        "  await test();\n" +
        "  for (let i = 0; i < 10; i++) {\n" +
        "    console.log(\"some code here\");\n" +
        "  }\n" +
        "}",

      output: "import fs from 'fs';\n" +
        "import _ from 'lodash';\n" +
        "import path from 'path';\n" +
        "\n" +
        "async function test() {\n" +
        "  if(true) {\n" +
        "    const dynamic = await import(\"b\");\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "async function main() {\n" +
        "  await test();\n" +
        "  for (let i = 0; i < 10; i++) {\n" +
        "    console.log(\"some code here\");\n" +
        "  }\n" +
        "}"
    },

    {
      name: "15",
      errors: 1,
      only: true,

      code: "import _ from 'lodash';\n" +
        "\n" +
        "import fs from 'fs';\n" +
        "\n" +
        "import path from 'path';\n" +
        "\n" +
        "if(true) {\n" +
        "  import(\"b\")\n" +
        "    .then(obj => obj)\n" +
        "    .catch(err => err)\n" +
        "}",

      output: "import fs from 'fs';\n" +
        "import _ from 'lodash';\n" +
        "import path from 'path';\n" +
        "\n" +
        "if(true) {\n" +
        "  import(\"b\")\n" +
        "    .then(obj => obj)\n" +
        "    .catch(err => err)\n" +
        "}"
    },

    {
      name: "16",
      errors: 1,
      only: true,

      code: "import fs from 'fs';\n" +
        "// dsandasmdklsaklm\n" +
        "const dynamic = import(\"my-dynamic-import\");\n" +
        "import _ from 'lodash';\n" +
        "import path from 'path';",

      output: "import fs from 'fs';\n" +
        "import _ from 'lodash';\n" +
        "import path from 'path';\n" +
        "\n" +
        "// dsandasmdklsaklm\n" +
        "const dynamic = import(\"my-dynamic-import\");"
    },
  ]
});
