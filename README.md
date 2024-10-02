
# GitHub User Activity CLI

A simple command-line interface (CLI) tool that fetches and displays the recent activity of a GitHub user. The tool supports filtering activities by event type and uses caching to improve performance.

This Task Tracker CLI project is based on a project from [roadmap.sh](https://roadmap.sh), you can find more details about this project here: [GitHub User Activity Project](https://roadmap.sh/projects/github-user-activity)

## Features

- Fetch and display a user's recent GitHub activity, including events such as `PushEvent`, `ForkEvent`, `PullRequestEvent`, and more.
- Filter activities by event type (e.g., `ForkEvent`).
- Caches the results for a specified duration to reduce API calls and improve speed.

## Prerequisites

Ensure you have the following installed:

- **Node.js** (version 18 or later for native `fetch` support).

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ranggaradiitya/github-user-activity-cli.git
   cd github-user-activity-cli
   ```

2. Link the project to create a global CLI command:
   
   ```bash
   npm link
   ```

## Usage

### Basic Command

To fetch and display a user's recent GitHub activity, simply use:

```bash
github-activity <username>
```

Example:

```bash
github-activity kamranahmedse
```

This will display the user's recent GitHub activity, such as pushed commits, created pull requests, or starred repositories.

### Filtering Events by Type

You can filter the displayed events by specifying the event type as an additional argument:

```bash
github-activity <username> <eventType>
```

Example:

```bash
github-activity kamranahmedse ForkEvent
```

This will display only the events of type `ForkEvent` for the user `kamranahmedse`.

If no events of the specified type are found:

```bash
$ github-activity kamranahmedse NonExistentEvent
No events of type "NonExistentEvent" found for user "kamranahmedse".
```

### Cached Data

The tool uses a cache to avoid redundant API requests. The cache lasts for **5 minutes**. When using cached data, the tool will notify you with a message:

```bash
Using cached data...
```

## Supported Event Types

You can filter activities by the following GitHub event types:

- `PushEvent`: Display events where commits were pushed.
- `ForkEvent`: Display events where a repository was forked.
- `IssuesEvent`: Display events related to issues.
- `PullRequestEvent`: Display events related to pull requests.
- `WatchEvent`: Display events where repositories were starred.

For the full list of GitHub events, refer to the [GitHub Event Types documentation](https://docs.github.com/en/rest/using-the-rest-api/github-event-types?apiVersion=2022-11-28).

## Error Handling

The CLI provides error handling for common issues:

- **User not found**: If the username provided is invalid, you'll see this error message:

  ```bash
  Error: User not found. Please provide a valid GitHub username.
  ```

- **API Rate Limit Exceeded**: If you've made too many requests to the GitHub API, you'll receive a rate limit error:

  ```bash
  Error: API rate limit exceeded. Please try again later.
  ```

## Example Output

```bash
$ github-activity kamranahmedse
-----------------------------------
User: kamranahmedse
Bio: I love building things 🧑‍💻
Public Repositories: 101
Followers: 34276
-----------------------------------
Event: ForkEvent
Repo: TejasQ/gen-subs
Action: Forked TejasQ/gen-subs
-----------------------------------
Event: PushEvent
Repo: kamranahmedse/developer-roadmap
Action: Pushed 1 commits to kamranahmedse/developer-roadmap
-----------------------------------
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
