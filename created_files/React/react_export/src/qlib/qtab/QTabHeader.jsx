

const QTabHeader = ({
  onClick,
  isActive,
  indicatorColor,
  indicatorHeight,
  children,
  tailwaindClasses = "",
  tabDirection = "Top",
}) => {
  const getStyle = () => {
    if (!isActive) return {};

    switch (tabDirection) {
      case "Top":
        return { borderBottom: `${indicatorHeight} solid ${indicatorColor}` };
      case "Bottom":
        return { borderTop: `${indicatorHeight} solid ${indicatorColor}` };
      case "Left":
        return {
          backgroundColor: indicatorColor,
        //  paddingLeft: "8px",
        };
      case "Right":
        return {
          backgroundColor: indicatorColor,
        //  paddingRight: "8px",
        };
      default:
        return {};
    }
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer ${tailwaindClasses} ${isActive ? "font-bold" : ""}`}
      style={getStyle()}
    >
      {children}
    </div>
  );
};

QTabHeader.displayName = "QTabHeader";
export default QTabHeader;
