#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the GitHub username and event type from the command line arguments
const username = process.argv[2];
const eventType = process.argv[3]; // Optional argument for filtering event types

// Exit if no username is provided
if (!username) {
  console.log('Please provide a GitHub username.');
  process.exit(1);
}

// GitHub API endpoints
const eventsUrl = `https://api.github.com/users/${username}/events`;
const userUrl = `https://api.github.com/users/${username}`;

// Cache settings
const cacheFile = path.join(__dirname, `cache_${username}.json`);
const cacheDuration = 5 * 60 * 1000; // Cache duration: 5 minutes

// Validate cache based on file modification time
const isCacheValid = () => {
  if (fs.existsSync(cacheFile)) {
    const stats = fs.statSync(cacheFile);
    const currentTime = new Date().getTime();
    const fileTime = new Date(stats.mtime).getTime();
    return currentTime - fileTime < cacheDuration;
  }
  return false;
};

// Save API response to cache
const saveCache = (data) => {
  fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));
};

// Fetch cached data
const fetchFromCache = () => {
  return JSON.parse(fs.readFileSync(cacheFile));
};

// Fetch data from GitHub API with error handling
const fetchGitHubData = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          'User not found. Please provide a valid GitHub username.'
        );
      } else if (response.status === 403) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else {
        throw new Error(
          `Failed to fetch data. Status Code: ${response.status}`
        );
      }
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Network error or invalid response: ${error.message}`);
  }
};

// Display user details
const displayUserDetails = (user) => {
  console.log('-----------------------------------');
  console.log(`User: ${user.login}`);
  console.log(`Bio: ${user.bio || 'No bio available'}`);
  console.log(`Public Repositories: ${user.public_repos}`);
  console.log(`Followers: ${user.followers}`);
  console.log('-----------------------------------');
};

// Display GitHub event details
const displayEvent = (event) => {
  let action = '';
  switch (event.type) {
    case 'PushEvent':
      action = `Pushed ${event.payload.commits.length} commits to ${event.repo.name}`;
      break;
    case 'IssuesEvent':
      action = `Opened a new issue in ${event.repo.name}`;
      break;
    case 'WatchEvent':
      action = `Starred ${event.repo.name}`;
      break;
    case 'ForkEvent':
      action = `Forked ${event.repo.name}`;
      break;
    case 'PullRequestEvent':
      action = `Created a pull request in ${event.repo.name}`;
      break;
    default:
      action = `Performed ${event.type} on ${event.repo.name}`;
  }
  console.log('-----------------------------------');
  console.log(`Event: ${event.type}`);
  console.log(`Repo: ${event.repo.name}`);
  console.log(`Action: ${action}`);
  console.log('-----------------------------------');
};

// Main function to fetch and display data
const main = async () => {
  try {
    let eventsToDisplay = [];

    // Check if cache is valid
    if (isCacheValid()) {
      console.log('Using cached data...');
      const cachedData = fetchFromCache();

      // Filter cached events by eventType if provided
      eventsToDisplay = cachedData.filter(
        (event) => !eventType || event.type === eventType
      );
    } else {
      // Fetch new data from API and save to cache
      const events = await fetchGitHubData(eventsUrl);
      if (Array.isArray(events)) {
        saveCache(events);
        eventsToDisplay = events.filter(
          (event) => !eventType || event.type === eventType
        );
      } else {
        console.log('No events found.');
        return;
      }
    }

    // Display events if found
    if (eventsToDisplay.length > 0) {
      // Fetch and display user details only if events exist
      const user = await fetchGitHubData(userUrl);
      displayUserDetails(user);

      eventsToDisplay.forEach(displayEvent);
    } else {
      console.log(
        `No events of type "${eventType}" found for user "${username}".`
      );
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

// Start the application
main();
