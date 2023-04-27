import React, { useEffect, useState } from "react";
import styles from "../../styles/Global.module.scss";

interface Project {
  name: string;
  description: string;
  url: string;
  repoUrl: string;
  languages_url: string;
  languages?: string[];
}

interface Props {
  githubUsername: string;
}

interface LanguageColors {
  [key: string]: string;
}

const languageColors: LanguageColors = {
  JavaScript: "#b49d08",
  TypeScript: "#007acc",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#6092c7",
  HTML: "#ff6347",
  CSS: "#563d7c",
  Shell: "#50c10a",
  PHP: "#4F5D95",
  SCSS: "#c6538c",
  Vue: "#33a06f",
};

const Main: React.FC<Props> = ({ githubUsername }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `https://api.github.com/users/devartes/repos?type=public`
      );
      const myRepos = await response.json();

      const orgResponse = await fetch(
        `https://api.github.com/orgs/wyvern-organs-donation/repos?type=public`
      );
      const orgRepos = await orgResponse.json();
      const orgReposWithHomepage = orgRepos
        .map((repo: any) => {
          if (!repo.homepage) {
            repo.homepage = false;
          }
          return repo;
        })
        .map((repo: any) => ({
          ...repo,
          homepage:
            repo.homepage ||
            `https://github.com/wyvern-organs-donation/${repo.name}`,
        }));

      const allRepos = [...myRepos, ...orgReposWithHomepage];
      const previewProjects: Project[] = allRepos
        .filter((repo: any) => repo.homepage)
        .map((repo: any) => ({
          name: repo.name,
          description: repo.description,
          url: repo.homepage,
          repoUrl: repo.html_url,
          languages_url: repo.languages_url,
        }));

      const promises = previewProjects.map(async (project) => {
        const response = await fetch(project.languages_url);
        const data = await response.json();
        project.languages = Object.keys(data);
        return project;
      });

      const resolvedProjects = await Promise.all(promises);
      setProjects(resolvedProjects);
    }

    fetchData();
  }, [githubUsername]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults(projects);
      return;
    }

    const results = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        (project.languages &&
          project.languages
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase())) ||
        (project.description &&
          project.description.toLowerCase().includes(query.toLowerCase()))
    );

    setSearchResults(results);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.searchContainer}>
          <span className={styles.backForwardIcons}>
            <img
              src="https://www.svgrepo.com/show/500472/back.svg"
              alt="icon arrow back"
              width={20}
            />
            <img
              src="https://www.svgrepo.com/show/500674/right.svg"
              alt="icon arrow right"
              width={20}
            />
          </span>
          <input
            type="search"
            placeholder="Procurar no Portfólio"
            value={searchQuery}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <span>
            <img
              src="https://www.svgrepo.com/show/435530/update.svg"
              alt="icon update"
              width={20}
            />
          </span>
        </div>
      </header>
      <main className={styles.main}>
        <h3 className={styles.projectsTitle}>Projetos:</h3>
        <div
          className={styles.projectContainer}
          style={{
            display:
              (searchQuery.trim() === "" ? projects : searchResults).length < 6
                ? "flex"
                : "grid",
            gridTemplateColumns:
              (searchQuery.trim() === "" ? projects : searchResults).length < 6
                ? "none"
                : "repeat(auto-fit, minmax(204px, 1fr))",
          }}
        >
          {(searchQuery.trim() === "" ? projects : searchResults).map(
            (project, index) => (
              <div
                key={index}
                className={styles.project}
                style={{
                  maxWidth: searchQuery.trim() === "" ? "none" : "204px",
                  minHeight: searchQuery.trim() === "" ? "none" : "204px",
                }}
              >
                <div className={styles.specification}>
                  <div className={styles.specificationPreview}>
                    {project.url &&
                      (project.url.endsWith(".vercel.app") ||
                        project.url.endsWith(".html") ||
                        project.url.endsWith(".php")) && (
                        <button
                          className={styles.viewProject}
                          onClick={() => window.open(project.url, "_blank")}
                        >
                          <img
                            src="https://www.svgrepo.com/show/458429/view-alt.svg"
                            alt="eye icon"
                            width={25}
                          />
                        </button>
                      )}
                    <button
                      className={styles.viewRepo}
                      onClick={() => window.open(project.repoUrl, "_blank")}
                    >
                      <img
                        src="https://www.svgrepo.com/show/374307/github.svg"
                        alt="github icon"
                        width={25}
                      />
                    </button>
                  </div>
                  <h4 className={styles.name}>{project.name}</h4>
                  {project.languages && project.languages.length > 0 && (
                    <div className={styles.languages}>
                      {project.languages.map((language) => (
                        <span
                          key={language}
                          className={styles.language}
                          style={{ backgroundColor: languageColors[language] }}
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className={styles.description}>{project.description}</p>
              </div>
            )
          )}
        </div>
      </main>
    </>
  );
};

export { Main };
