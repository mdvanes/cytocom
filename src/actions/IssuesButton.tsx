import { FC } from "react";
import githubLogo from "./github-mark-white.svg";
import styles from "./IssuesButton.module.css";

export const IssuesButton: FC = () => {
  return (
    <a
      title="If you find a problem with the data, you can file an issue here"
      href="https://github.com/mdvanes/cytocom/issues"
      className={styles["issues-button"]}
    >
      <img src={githubLogo} alt="Github Issues" />
      <div>issues</div>
    </a>
  );
};
