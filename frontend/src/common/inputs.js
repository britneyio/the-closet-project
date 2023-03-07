import React from 'react';
import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import colors from './colors';
import { ModalHeader } from './fonts';

export const StyledModal = styled(Modal)`
    & .modal-content {
        background-color: ${colors.background1};
    }
    justify-content:space-between;
    button {
        background-color: ${colors.highlight1};
        margin-left: 20px;
        margin-top: 10px;
    }

    button:hover {
        background-color: ${colors.highlight3};
    }
`;