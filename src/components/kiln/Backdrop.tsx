/*
 * The studio behind every page: coal, a warm glow from the kiln at the top,
 * a cooler fall-off at the bottom, and film grain. Static, so it costs nothing.
 */
export const Backdrop: React.FC = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
    <div className="absolute -top-[30vh] left-1/2 -translate-x-1/2 w-[140vw] h-[80vh] rounded-[50%] bg-[radial-gradient(closest-side,rgba(217,98,43,0.16),rgba(142,45,18,0.06)_55%,transparent)]" />
    <div className="absolute bottom-0 inset-x-0 h-[40vh] bg-[linear-gradient(to_top,rgba(5,3,2,0.6),transparent)]" />
    <div className="absolute inset-0 grain opacity-[0.05] mix-blend-overlay" />
  </div>
);

export default Backdrop;
