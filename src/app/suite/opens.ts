import { createContext, useContext } from "react";
/** Can the signed-in person open this screen? (Department Team can close screens for a person.) Homes hide links to closed screens. */
export const OpensContext = createContext<(screen: string) => boolean>(() => true);
export const useOpens = () => useContext(OpensContext);
