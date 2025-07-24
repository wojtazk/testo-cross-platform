import { useEffect, useState } from 'react';

export type GitHubRelease = { version: string; html_url: string } | null;

export const useLatestAppRelease = () => {
  const [latesAppRelease, setLatesAppRelease] = useState<GitHubRelease>(null);
  useEffect(() => {
    const fetchLatestTag = async () => {
      const response = await fetch(
        'https://api.github.com/repos/wojtazk/testo-cross-platform/releases/latest'
      );
      if (!response.ok) {
        console.error(
          `Error fetching GitHub latest release tag: ${response.statusText}`
        );
      }
      const data = await response.json();
      console.log('Latest App Release: ', data);
      setLatesAppRelease({
        version: (data.tag_name as string).replace('app-v', ''),
        html_url: data.html_url,
      });
    };

    fetchLatestTag();
  }, [setLatesAppRelease]);

  return { latesAppRelease };
};
