# Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Private GHCR package blocks image pulls | High (occurred) | High | Document requirement to set packages public; add to setup guide |
| GitHub Actions default permissions block registry push | High (occurred) | Medium | Added explicit `permissions: packages: write` to CI workflow |
| Local `kind` cluster differs from production K8s | Medium | Medium | Document as known limitation; note fallback path per project spec |
| No named external stakeholder for problem validation | High | Medium | Use course mentor as stakeholder-of-record; document review sign-off |
