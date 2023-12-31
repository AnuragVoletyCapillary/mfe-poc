import React, { useEffect, useState, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import withStyles from 'utils/withStyles';

import { withRouter } from 'react-router';
import { matchPath } from 'react-router-dom';

import CapSpin from '@capillarytech/cap-ui-library/CapSpin';
import CapSomethingWentWrong from '@capillarytech/cap-ui-library/CapSomethingWentWrong';
import multipleOrgSwitch from '@capillarytech/cap-ui-utils/utils/multipleOrgSwitch';

import sagas from './saga';
import * as actions from './actions';
import * as style from './style';

import NavigationBar from '../../organisms/NavigationBar';
import OrgChange from '../../organisms/OrgChange';

import componentRoutes from './routes';
import * as path from '../../../config/path';
import * as constants from './constants';
import * as appConstants from '../App/constants';
import * as selectors from './selectors';
import config from '../../../config/app';
import messages from './messages';


const Label = lazy(() => import('HeaderApp/Label'));


const { REQUEST, SUCCESS, FAILURE } = appConstants;
const { publicPath } = path;
const { spinnerStyle } = style;
const {
  makeSelectOrg,
  makeSelectCap,
  makeSelectSidebarMenuData,
  makeSelectTopbarMenuData,
} = selectors;
const {
  HELP_URL,
  ORG_SETTINGS_URL,
  LOYALTY_SETTINGS_URL,
  LOYALTY_NOTIFICATION_URL,
  SIDEBAR_MENU_ITEM_POSITION,
  MODULE_NAME_URL,
  PRODUCTION,
} = constants;

const { isMultipleTabsOpen } = multipleOrgSwitch;

const StyledCapSpin = withStyles(CapSpin, spinnerStyle);
const gtm = window.dataLayer || [];

export const Cap = ({
  topbarMenuData = [],
  sidebarMenuData,
  history,
  actions,
  match,
  userData,
  orgData,
  intl: { formatMessage },
}) => {
  const { pathname } = location;
  const { orgID, fetchingUserdata } = orgData;
  const { user } = userData;
  const { refID } = user;
  const matchedPath = matchPath(pathname, {
    path: `${match.path}${MODULE_NAME_URL}`,
  });

  // need to handle for modules
  // const { params: { moduleName } = {} } = matchedPath || {};
  const onSettingsPage = matchedPath ? true : false;

  const [selectedOrgId, setSelectedOrgId] = useState(null);

  useEffect(
    () => {
      const getUserGtmData = userData => {
        const userName = userData?.attributes?.USERNAME;
        const userEmail = userData?.attributes?.EMAIL;
        const orgObj = userData?.proxyOrgList?.find(org => org.orgID === orgID);
        const gtmData = {
          orgID,
          orgName: orgObj?.orgName,
          userId: userData?.refID,
          userName: userName?.value,
          userEmail: userEmail?.value,
          isCapUser: userData?.isCapUser,
        };
        return gtmData;
      };
      if (refID !== undefined) {
        const userGtmData = getUserGtmData(user);
        gtm.push(userGtmData);
      }
      if (orgID !== undefined) {
        gtm.push({ orgID });
      }
    },
    [refID, orgID],
  );

  useEffect(
    () => {
      actions.getTopbarMenuData();
      actions.getLastSyncTime();
      if (!fetchingUserdata) {
        actions.getUserData();
      }
      return () => {
        actions.clearTopbarMenuData();
      };
    },
    [actions],
  );

  const changeOrg = orgId => {
    if (isMultipleTabsOpen()) {
      setSelectedOrgId(orgId);
    } else {
      changeOrgAction(orgId);
    }
  };

  const changeOrgAction = orgId => {
    actions.changeOrg(orgId, navigateToDashboard);
  };

  const navigateToDashboard = () => {
    const defaultPage =
      process.env.NODE_ENV === PRODUCTION
        ? config.production.dashboard_url
        : config.development.dashboard_url;
    const originUrl = window.location.origin;
    window.location.href = `${originUrl}${defaultPage}`;
  };

  const logout = () => {
    actions.logout();
  };

  const onSecNavActionsClick = event => {
    if (event.key === 'close-icon') {
      window.location.pathname = publicPath;
    }
  };

  const onClickReload = () => {
    window.location.reload();
  };

  return (
    <StyledCapSpin
      className="cap-container spinner"
      spinning={fetchingUserdata === REQUEST}
    >
      <Suspense fallback={<div>Loading Header...</div>}>
        <Label text={'Anurag'} type={'h5'}/>
      </Suspense>
    </StyledCapSpin>
  );
};

Cap.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  orgData: PropTypes.object,
  userData: PropTypes.object,
  topbarMenuData: PropTypes.array,
  sidebarMenuData: PropTypes.array,
  actions: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
};

Cap.defaultProps = {};

const mapStateToProps = createStructuredSelector({
  orgData: makeSelectOrg(),
  userData: makeSelectCap(),
  sidebarMenuData: makeSelectSidebarMenuData(),
  topbarMenuData: makeSelectTopbarMenuData(),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = sagas.map((saga, index) =>
  injectSaga({ key: `cap-${index}`, saga }),
);

export default compose.apply(null, [...withSaga, withConnect])(
  withRouter(injectIntl(Cap)),
);
