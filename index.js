/**
 * Umbrella bundle for the EXV theme pack.
 *
 * The Host half only declares the three plugin rows through cordis.patch.yml;
 * every piece of runtime code lives in the dsh-exv-* sub-packages, so this
 * package stays small and the sub-packages can be published and versioned on
 * their own. Installing this package installs the whole theme.
 */
export function apply() {}
