import ProfileForm from "../../components/ProfileForm";

const AdminProfile = () => (
  <ProfileForm
    endpoint="/getadmin"
    description="View and update your administrator details."
  />
);

export default AdminProfile;
