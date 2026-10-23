import ProfileForm from "../../components/ProfileForm";

const MyProfile = () => (
  <ProfileForm
    endpoint="/getdriver"
    description="View and update your driver details."
  />
);

export default MyProfile;
