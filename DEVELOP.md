# Development

## Incorporating changes from the boilerplate

Due to GitHub limitations this project has not been forked from the [boilerplate project](https://github.com/WoodWing/csde-components-boilerplate). Incorporating the latest changes from the boilerplate is therefore slightly more work.
	
1. Create and switch to a new branch.

		$> git checkout -b <yourbranch> 

2. Add the boilerplate as remote.

		$> git remote add upstream https://github.com/WoodWing/csde-components-boilerplate

3. Pull in the latest changes from the boilerplate.

		$> git pull upstream master --no-ff

4. Resolve merge conflicts. In particular this `README.md` will result in conflicts. In most cases you want to ignore the changes to boilerplate's `README.md`.

5. Push your changes to the remote.

		$> git push origin <yourbranch>

6. Create a pull request.
