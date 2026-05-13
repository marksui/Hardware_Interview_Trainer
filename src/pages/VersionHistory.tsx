import { GitBranch, History, Rocket } from "lucide-react";
import { APP_VERSION, CHANGELOG } from "../utils/version";

const totalChanges = CHANGELOG.reduce(
  (count, release) => count + release.changes.length,
  0,
);

export function VersionHistory() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel p-8">
          <span className="badge-pill bg-surface-soft text-primary">
            Current version v{APP_VERSION}
          </span>
          <h2 className="display-heading mt-5 text-4xl leading-tight">
            Release notes for a portfolio project that keeps improving.
          </h2>
          <p className="mt-4 text-base leading-7 text-body">
            This page tracks product-level changes separately from the footer so
            the app stays clean while reviewers can still inspect development
            progress.
          </p>
        </div>

        <div className="product-panel p-6">
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <div>
              <p className="text-sm font-semibold text-primary">Release log</p>
              <p className="text-sm text-muted">
                Local-first hardware interview trainer
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-card text-primary">
              <History size={22} aria-hidden="true" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md bg-surface-soft p-4">
              <p className="text-xs font-medium text-muted">Latest</p>
              <p className="mt-2 text-lg font-semibold text-primary">
                v{APP_VERSION}
              </p>
            </div>
            <div className="rounded-md bg-surface-soft p-4">
              <p className="text-xs font-medium text-muted">Releases</p>
              <p className="mt-2 text-lg font-semibold text-primary">
                {CHANGELOG.length}
              </p>
            </div>
            <div className="rounded-md bg-surface-soft p-4">
              <p className="text-xs font-medium text-muted">Tracked changes</p>
              <p className="mt-2 text-lg font-semibold text-primary">
                {totalChanges}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="display-heading text-[28px] leading-tight">
              Version history
            </h2>
            <p className="mt-2 text-sm leading-6 text-body">
              Each release records what changed in the app, documentation, and
              deployment surface.
            </p>
          </div>
          <span className="badge-pill bg-surface-soft text-primary">
            GitHub Pages ready
          </span>
        </div>

        <div className="mt-6 grid gap-4">
          {CHANGELOG.map((release, index) => (
            <article className="product-panel p-5" key={release.version}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-card text-primary">
                    {index === 0 ? (
                      <Rocket size={21} aria-hidden="true" />
                    ) : (
                      <GitBranch size={21} aria-hidden="true" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      v{release.version} · {release.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-muted">
                      {release.date}
                    </p>
                  </div>
                </div>

                {index === 0 ? (
                  <span className="badge-pill bg-emerald-100 text-ink-950">
                    Latest
                  </span>
                ) : null}
              </div>

              <ul className="mt-5 grid gap-2 text-sm leading-6 text-body">
                {release.changes.map((change) => (
                  <li className="flex gap-2" key={change}>
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-action" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
