## Livestax Simulator

The Livestax Simulator is a tool for developers who are building
[Livestax] applications.

The Livestax Simulator is hosted at http://simulator.livestax.com and
provides an environment to simulate how an application  will behave
within Livestax.

The Simulator is typically used throughout the app building process,
providing an easy way for developers to get feedback on how their app
interfaces with the [Livestax JavaScript API].

## Install

```bash
npm install
npm start
open http://localhost:3001
```

You can also change the port via an environment variable with:

```bash
PORT=3002 npm start
```

## Running the tests

```bash
npm test
```

## Contributing

We'd love to get contributions from you!
Follow the instructions below on how to make pull requests.
For our full contribution guideline see the
[Livestax Contribution Document]

## Pull requests

1. [Fork] the project, clone your fork, and configure the remotes
2. Create a new topic branch (off of `master`) to contain your feature,
   chore, or fix.
3. Commit your changes in logical units.
4. Make sure all the tests are still passing
5. Push your topic branch up to your fork
6. [Open a Pull Request] with a clear title and description.

## License

Code released under the MIT license. Docs released under Creative
Commons.

[Livestax]: http://livestax.com
[Livestax JavaScript API]: http://developers.livestax.com
[Livestax Contribution Document]: https://github.com/livestax/app-github/blob/master/CONTRIBUTING.md
[Fork]: http://help.github.com/fork-a-repo/
[Open a Pull Request]: https://help.github.com/articles/using-pull-requests/

