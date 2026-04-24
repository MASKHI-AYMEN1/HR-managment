import React from 'react'
import { MdSpaceDashboard, MdRateReview, MdQuestionAnswer, MdSecurity } from 'react-icons/md'
import { PiVideoConference } from 'react-icons/pi'
import { FaHandHoldingHeart, FaUserTie, FaLaptopCode, FaUserCheck } from 'react-icons/fa'
import { GiModernCity } from 'react-icons/gi'
import { PiPackageBold } from 'react-icons/pi'
import { MdCategory } from 'react-icons/md'
import { RxStitchesLogo } from 'react-icons/rx'
import { HiOutlineDocumentDuplicate } from 'react-icons/hi2'
import {
  ADMIN_CALENDAR_PATH,
  ADMIN_CUSTOMER_PATH,
  ADMIN_DASHBOARD_PATH,
  ADMIN_DIAGNOSTIC_PATH,
  ADMIN_DOCUMENT_PATH,
  ADMIN_EVALUATIONS_PATH,
  ADMIN_INTERVIEWS_PATH,
  ADMIN_INTERVIEW_RH_PATH,
  ADMIN_INTERVIEW_TECHNIQUE_PATH,
  ADMIN_INTERVIEW_MANAGER_PATH,
  ADMIN_PROFILES_PATH,
  ADMIN_PACKAGE_PATH,
  } from '@/common/constants/paths'
import { IoConstructSharp } from 'react-icons/io5'
import { FaCalendarAlt } from 'react-icons/fa'

import { FormattedMessage } from 'react-intl'


export const menuAdminItems = [
  {
    href: ADMIN_DASHBOARD_PATH,
    icon: <MdSpaceDashboard className="text-2xl" />,
    label: <FormattedMessage id="menuAdminItems.dashboard" defaultMessage="Dashboard" />,
    title: <>
      <FormattedMessage id="menuAdminItems.dashboard" defaultMessage="Dashboard" />
    </>,
    hover: {
      rotate: [10, 0, -10, 0, 20, 0, -20],
    },
    enabled:true
  },
  {
    href: ADMIN_CUSTOMER_PATH,
    icon: <PiVideoConference className="text-3xl" />,
    label: <FormattedMessage id="menuAdminItems.clients" defaultMessage="Clients" />,
    title: <>
      <FormattedMessage id="menuAdminItems.list" defaultMessage="Liste" />
      {' '}
      <FormattedMessage id="menuAdminItems.clients" defaultMessage="Clients" />
    </>,
    hover: {
      rotate: [10, 0, -10, 0, 20, 0, -20],
    },
    enabled:true
  },
  {
    href: ADMIN_DOCUMENT_PATH,
    icon: <HiOutlineDocumentDuplicate className="text-3xl" />,
    label: <FormattedMessage id="menuAdminItems.documents" defaultMessage="Offres" />,
    title: <>
      <FormattedMessage id="menuAdminItems.list" defaultMessage="Liste" />
      {' '}
      <FormattedMessage id="menuAdminItems.documents" defaultMessage="Offers" />
    </>,
    hover: {
      rotate: [10, 0, -10, 0, 20, 0, -20],
    },
        enabled:true
  },
  {
    href: ADMIN_DIAGNOSTIC_PATH,
    icon: <IoConstructSharp className="text-2xl" />,
    label: <FormattedMessage id="menuAdminItems.diagnostic" defaultMessage="Diagnostic" />,
    title: <>
      <FormattedMessage id="menuAdminItems.diagnostic" defaultMessage="Diagnostic" />
    </>,
    hover: {
      rotate: [10, 0, -10, 0, 20, 0, -20],
    },
    enabled: true,
  },
  {
    href: ADMIN_EVALUATIONS_PATH,
    icon: <MdRateReview className="text-2xl" />,
    label: <FormattedMessage id="menuAdminItems.evaluations" defaultMessage="Évaluations" />,
    title: <>
      <FormattedMessage id="menuAdminItems.evaluations" defaultMessage="Évaluations" />
    </>,
    hover: {
      rotate: [10, 0, -10, 0, 20, 0, -20],
    },
    enabled: false, // Désactivé - Remplacé par les entretiens RH/Technique/Manager
  },
  {
    href: ADMIN_INTERVIEW_RH_PATH,
    icon: <FaUserTie className="text-2xl" />,
    label: <FormattedMessage id="menuAdminItems.interviewRH" defaultMessage="Entretien RH" />,
    title: <>
      <FormattedMessage id="menuAdminItems.interviewRH" defaultMessage="Entretien RH" />
    </>,
    hover: {
      rotate: [10, 0, -10, 0, 20, 0, -20],
    },
    enabled: true,
  },
  {
    href: ADMIN_INTERVIEW_TECHNIQUE_PATH,
    icon: <FaLaptopCode className="text-2xl" />,
    label: <FormattedMessage id="menuAdminItems.interviewTechnique" defaultMessage="Entretien Technique" />,
    title: <>
      <FormattedMessage id="menuAdminItems.interviewTechnique" defaultMessage="Entretien Technique" />
    </>,
    hover: {
      rotate: [10, 0, -10, 0, 20, 0, -20],
    },
    enabled: true,
  },
  {
    href: ADMIN_INTERVIEW_MANAGER_PATH,
    icon: <FaUserCheck className="text-2xl" />,
    label: <FormattedMessage id="menuAdminItems.interviewManager" defaultMessage="Entretien Manager" />,
    title: <>
      <FormattedMessage id="menuAdminItems.interviewManager" defaultMessage="Entretien Manager" />
    </>,
    hover: {
      rotate: [10, 0, -10, 0, 20, 0, -20],
    },
    enabled: true,
  },
  {
    href: ADMIN_PROFILES_PATH,
    icon: <MdSecurity className="text-2xl" />,
    label: <FormattedMessage id="menuAdminItems.profiles" defaultMessage="Profils" />,
    title: <>
      <FormattedMessage id="menuAdminItems.profiles" defaultMessage="Profils" />
    </>,
    hover: {
      rotate: [10, 0, -10, 0, 20, 0, -20],
    },
    enabled: true,
  },
  {
    href: ADMIN_CALENDAR_PATH,
    icon: <FaCalendarAlt className="text-2xl" />,
    label: <FormattedMessage id="menuAdminItems.calendar" defaultMessage="Calendrier" />,
    title: <>
      <FormattedMessage id="menuAdminItems.calendar" defaultMessage="Calendrier" />
    </>,
    hover: {
      rotate: [10, 0, -10, 0, 20, 0, -20],
    },
    enabled: true,
  },
  {
    href: ADMIN_PACKAGE_PATH,
    icon: <PiPackageBold className="text-2xl" />,
    label: <FormattedMessage id="menuAdminItems.packages" defaultMessage="Packages" />,
    title: <>
      <FormattedMessage id="menuAdminItems.list" defaultMessage="Liste" />
      {' '}
      <FormattedMessage id="menuAdminItems.packages" defaultMessage="Données" />
    </>,
    hover: {
      rotate: [10, 0, -10, 0, 20, 0, -20],
    },
        enabled:false
  },
]
