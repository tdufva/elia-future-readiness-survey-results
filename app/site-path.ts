const githubBasePath = "/elia-future-readiness-survey-results";

export function sitePath(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${process.env.GITHUB_PAGES === "true" ? githubBasePath : ""}${normalized}`;
}
