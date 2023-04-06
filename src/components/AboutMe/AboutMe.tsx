import React from "react";
import styles from "../../styles/Global.module.scss";

interface AboutMeProps {
  name: string;
  github: string;
  gitlab: string;
  wordpress: string;
  linkedin: string;
}

const AboutMe: React.FC<AboutMeProps> = ({
  name,
  github,
  gitlab,
  wordpress,
  linkedin,
}: AboutMeProps) => {
  return (
    <div className={styles.aboutMe}>
      <h2 className={styles.myName}>{name}</h2>
      <p className={styles.profession}>Desenvolvedora Web/Front-end</p>
      <div className={styles.icons}>
        <a href={github} target="_blank" rel="noreferrer">
          <img
            src="https://icongr.am/devicon/github-original.svg?size=30&color=currentColor"
            alt="github"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </a>
        <a href={gitlab} target="_blank" rel="noreferrer">
          <img
            src="https://icongr.am/devicon/gitlab-original.svg?size=30&color=currentColor"
            alt="gitlab"
          />
        </a>
        <a href={wordpress} target="_blank" rel="noreferrer">
          <img
            src="https://icongr.am/devicon/wordpress-original.svg?size=30&color=currentColor"
            alt="wordpress"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </a>
        <a href={linkedin} target="_blank" rel="noreferrer">
          <img
            src="https://icongr.am/devicon/linkedin-original.svg?size=30&color=currentColor"
            alt="Linkedin"
          />
        </a>
      </div>
    </div>
  );
};

export default AboutMe;
