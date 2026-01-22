import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";

const QDrawerBody = ({
  children,
}) => {
 

  return (
    <>
      {children}
    </>
  );
};

// ✅ PropTypes for only used props
QDrawerBody.propTypes = {
  children: PropTypes.node,
};

export default QDrawerBody;
QDrawerBody.displayName = "QDrawerBody";
