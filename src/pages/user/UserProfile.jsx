import ProfileForm from "../../components/ProfileForm";

const UserProfile = () => (
  <ProfileForm
    endpoint="/getuser"
    description="View and update your account details."
  />
);

export default UserProfile;
