import React, { useEffect, useState } from "react";
import AboutMe from "../AboutMe/AboutMe";
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
  const [year, setYear] = useState(new Date().getFullYear());

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

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Portfólio</h1>
      </header>
      <main className={styles.main}>
        <AboutMe
          name="Ana Carolina Duarte Cavalcante"
          github="https://github.com/devartes"
          gitlab="https://gitlab.com/devartes"
          wordpress="https://anacarolinadc.me/"
          linkedin="https://www.linkedin.com/in/anacdcavalcante"
        />
        <h3 className={styles.projectsTitle}>Projetos:</h3>
        <div className={styles.projectContainer}>
          {projects.map((project, index) => (
            <div key={index} className={styles.project}>
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
          ))}
        </div>
      </main>
      <footer className={styles.footer}>
        <p>Feito com 💛 © {year}</p>
      </footer>
    </>
  );
};

export { Main };
