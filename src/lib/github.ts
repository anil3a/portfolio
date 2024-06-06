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

export const getAllRepos = async (username: string, numPages=3) => {

  const pages = Array.from({ length: numPages }, (_, i) => i + 1);
	const fetchPromises = pages.map(page =>
		fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`, {
			headers: { Authorization: `Bearer ${process.env.GH_TOKEN}` },
		})
	);
	const responses = await Promise.all(fetchPromises);
	const resjson = await Promise.all(responses.map(res => res.json()));
	let repos = resjson.flat(); // Combine the repos from all pages into a single 

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

  return sorted;
};
