type Repository = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description?: string;
  fork: boolean;
  archived: boolean;
  updated_at?: string;
  stargazers_count: number;
  watchers_count: number;
  visibility: string;
  language: string;
};

interface Activity {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    display_login: string;
    gravatar_id: string;
    url: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: {
    repository_id: number;
    push_id: number;
    size: number;
    distinct_size: number;
    ref: string;
    head: string;
    before: string;
    action: string;
    ref_type: string;
    pull_request: {
      merged: number;
    }
    commits: {
      sha: string;
      author: {
        email: string;
        name: string;
      };
      message: string;
      distinct: boolean;
      url: string;
    }[];
  };
  public: boolean;
  created_at: string;
}

interface ActivitySummary {
  commits?: number;
  reviews?: number;
  commentsCreated?: number;
  commentsEdited?: number;
  prsOpened?: number;
  prsMerged?: number;
  branches?: number;
  tags?: number;
  PushEvent?: number;
  PullRequestReviewEvent?: number;
  IssueCommentEvent?: number;
  PullRequestEvent?: number;
  CreateEvent?: number;
  [key: string]: number | undefined;
}

export const getAllRepos = async (username: string, numPages=3, limit=20) => {

  const pages = Array.from({ length: numPages }, (_, i) => i + 1);
	const fetchPromises = pages.map(page =>
		fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`, {
			headers: { Authorization: `Bearer ${process.env.GH_TOKEN}` },
		})
	);
	const responses = await Promise.all(fetchPromises);
	const resjson = await Promise.all(responses.map(res => res.json()));
	const repos = resjson.flat(); // Combine the repos from all pages into a single 

  const hiddenRepos = process.env.HIDDEN_REPOS ? process.env.HIDDEN_REPOS.split(',') : [];
  const exposingRepos = process.env.PROJECT_WHITELISTS ? process.env.PROJECT_WHITELISTS.split(',') : [];

  const sorted = repos
      .filter((p: Repository) => !p.fork)
      .filter((p: Repository) => !p.archived)
      .filter((p: Repository) => !hiddenRepos.includes(p.name))
      .sort(
        (a: Repository, b: Repository) => {

          const aInWhitelist = exposingRepos.includes(a.name);
          const bInWhitelist = exposingRepos.includes(b.name);
      
          if (aInWhitelist && !bInWhitelist) {
            return -1;
          }
          if (!aInWhitelist && bInWhitelist) {
            return 1;
          }

          // Check if descriptions contain "python"
          const a_content = a.description +' '+ a.name +' '+ a.language;
          const b_content = b.description +' '+ b.name +' '+ b.language;

          const aHasPython = a_content && a_content.toLowerCase().includes('python');
          const bHasPython = b_content && b_content.toLowerCase().includes('python');

          // Prioritize repositories with "python" in the description
          if (aHasPython && !bHasPython) return -1;
          if (!aHasPython && bHasPython) return 1;

          const stars = b.stargazers_count - a.stargazers_count;
          if(stars === 0){
            return stars;
          }

          // Sort by updated_at if neither or both contain "python"
          return new Date(b.updated_at ?? Number.POSITIVE_INFINITY).getTime() -
                  new Date(a.updated_at ?? Number.POSITIVE_INFINITY).getTime();
        }
      );

  return sorted.slice(0, limit);
};

export const getRecentUserActivity = async (username: string): Promise<string> => {
  const res = await fetch(`https://api.github.com/users/${username}/events`, {
    headers: { Authorization: `Bearer ${process.env.GH_TOKEN}` },
  });
  const response: Activity[] = await res.json();

  const activitySummary = response.reduce((acc: ActivitySummary, activity: Activity) => {
    if (activity.type === 'PushEvent') {
      acc.commits = acc.commits || 0;
      acc.commits += activity.payload.size;
    } else if (activity.type === 'PullRequestReviewEvent') {
      acc.reviews = acc.reviews || 0;
      acc.reviews++;
    } else if (activity.type === 'IssueCommentEvent') {
      acc.commentsCreated = acc.commentsCreated || 0;
      acc.commentsCreated += activity.payload.action === 'created' ? 1 : 0;
      acc.commentsEdited = acc.commentsEdited || 0;
      acc.commentsEdited += activity.payload.action === 'edited' ? 1 : 0;
    } else if (activity.type === 'PullRequestEvent') {
      acc.prsOpened = acc.prsOpened || 0;
      acc.prsOpened += activity.payload.action === 'opened' ? 1 : 0;
      acc.prsMerged = acc.prsMerged || 0;
      acc.prsMerged += activity.payload.action === 'closed' && activity.payload.pull_request.merged ? 1 : 0;
    } else if (activity.type === 'CreateEvent') {
      if (activity.payload.ref_type === 'tag') {
        acc.tags = acc.tags || 0;
        acc.tags++;
      } else {
        acc.branches = acc.branches || 0;
        acc.branches++;
      }
    }

    if (!acc[activity.type]) {
      acc[activity.type] = 0; // Initialize to 0 if undefined
    }
    acc[activity.type] = (acc[activity.type] || 0) + 1; // Increment the count safely

    return acc;
  }, {});

  const activitySummaryString = Object.keys(activitySummary)
    .map((key) => {
      const value = activitySummary[key];
      if (key === 'commits' && value) {
        return `pushed ${value} commit${value === 1 ? '' : 's'}`;
      } else if (key === 'reviews' && value) {
        return `reviewed ${value} PR${value === 1 ? '' : 's'}`;
      } else if (key === 'prsOpened' && value) {
        return `opened ${value} PR${value === 1 ? '' : 's'}`;
      } else if (key === 'prsMerged' && value) {
        return `merged ${value} PR${value === 1 ? '' : 's'}`;
      } else if (key === 'commentsCreated' && value) {
        return `made ${value} comment${value === 1 ? '' : 's'}`;
      } else if (key === 'branches' && value) {
        return `created ${value} branch${value === 1 ? '' : 'es'}`;
      } else if (key === 'tags' && value) {
        return `created ${value} tag${value === 1 ? '' : 's'}`;
      } else {
        return null;
      }
    })
    .filter(Boolean)
    .join(', ');

  return activitySummaryString;
};
