import carSettings from '@/modules/carSettings/locales/en'
import applications from '@/modules/application/locales/en'
import general from '@/modules/general/locales/en'
import settings from '@/modules/settings/locales/en'
import chat from '@/modules/chat/locales/en'
import motorcycleSettings from '@/modules/motorcycleSettings/locales/en'
import truckSettings from '@/modules/truckSettings/locales/en'
export default {
  base: {
    welcome: 'Welcome to Mashynbazar',
    name: 'Name',
    actions: 'Actions',
    noData: 'No data',
    loading: 'Loading ...',
    popular: 'Popular',
    choose: 'Choose',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    confirmDelete: 'Confirm delete',
    back: 'Back',
    error: 'Error',
    optional: 'optional',
    commaSeparated: 'Comma separated values',
    pageNotFound: 'Page Not Found',
    pageNotFoundDescription: 'The page you are looking for does not exist or you do not have access',
    backToHome: 'Back to Home',
    email: 'Email',
    password: 'Password',
    login: 'Login'
  },
  validation: {
    required: 'This field is required',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    usernameRequired: 'Username is required'
  },
  toast: {
    successSaved: 'Successfully saved',
    successUpdated: 'Successfully updated',
    successDeleted: 'Successfully deleted',
    errorSaving: 'Error while saving',
    loginSuccess: 'Login successful',
    loginError: 'Login failed'
  },
  sidebar: {
    applications: 'Applications',
    dealers: 'Dealers',
    logistics: 'Logistics',
    carServices: 'Car services',
    brokers: 'Brokers',
    users: 'Users',
    clients: 'Clients',
    chat: 'Chat',
    reports: 'Complaints',
    carSettings: 'Car settings',
    brands: 'Brands',
    bodyTypes: 'Body types',
    drivetrains: 'Drivetrains',
    engines: 'Engines',
    fuelTypes: 'Fuel types',
    transmissions: 'Transmissions',
    motorcycleSettings: 'Motorcycle settings',
    categories: 'Categories',
    parameters: 'Parameters',
    strokes: 'Strokes',
    truckSettings: 'Truck settings',
    general: 'General',
    cities: 'Cities',
    colors: 'Colors',
    activityFields: 'Activity fields',
    companyTypes: 'Company types',
    settings: 'Settings'
  },
  carSettings: carSettings,
  applications: applications,
  general: general,
  settings: settings,
  chat: chat,
  motorcycleSettings: motorcycleSettings,
  truckSettings: truckSettings
}
