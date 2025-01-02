# Codeowner Validator GitHub Action

![Example workflow](https://github.com/robmaxwellirl/codeowner-validator/actions/workflows/ci.yml/badge.svg)
![linting](https://github.com/robmaxwellirl/codeowner-validator/actions/workflows/linter.yml/badge.svg)

## What is this action for?

This action is to help validate that every file in a repository has an owner
defined in the codeowners file. Whilst GitHub can validate that a codeowners
file is correct, it does not actually ensure each file has an owner.

This will scan through the repository files, and if any file not found to have
an owner, it will alert on it and fail the check.

It will output the files not owned as part of the status check and output them.
They should be added to the codeowners file and the check will then pass.

## Usage

After testing, you can create version tag(s) that developers can use to
reference different stable versions of your action. For more information, see
[Versioning](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
in the GitHub Actions toolkit.

To include the action in a workflow in another repository, you can use the
`uses` syntax with the `@` symbol to reference a specific branch, tag, or commit
hash.

### Inputs

token: Plan GitHub token used to auth to the repository. codecodeowners-file:
location of file if not located at `.github/CODEOWNERS`

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: Validate files have owners
    uses: robmaxwellirl/codeowner-validator@v1
    with:
      token: ${{ secrets.GITHUB_TOKEN }}
```

## Building and testing locally

After you've cloned the repository to your local machine or codespace, you'll
need to perform some initial setup steps before you can develop your action.

> [!NOTE]
>
> You'll need to have a reasonably modern version of
> [Node.js](https://nodejs.org) handy. If you are using a version manager like
> [`nodenv`](https://github.com/nodenv/nodenv) or
> [`nvm`](https://github.com/nvm-sh/nvm), you can run `nodenv install` in the
> root of your repository to install the version specified in
> [`package.json`](./package.json). Otherwise, 20.x or later should work!

1. :hammer_and_wrench: Install the dependencies

   ```bash
   npm install
   ```

1. :building_construction: Package the TypeScript for distribution

   ```bash
   npm run bundle
   ```

1. :white_check_mark: Run the tests

   ```bash
   $ npm test

   PASS  ./index.test.js
     ✓ throws invalid number (3ms)
     ✓ wait 500 ms (504ms)
     ✓ test runs (95ms)

   ...
   ```
