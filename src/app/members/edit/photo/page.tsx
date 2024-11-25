import CardInnerWrapper from "@/components/CardInnerWrapper";
import MemberPhotoUpload from "./_MemberUploadPhoto";
import MemberPhoto from "@/components/MemberPhoto";
import { getMemberPhotoByUserId } from "@/actions/user.action";

export default async function MemberEditPhotoPage() {
    const photo = await getMemberPhotoByUserId();

  return (
    <CardInnerWrapper
      header="Upload Photo"
      body={
        <>
          <MemberPhotoUpload />
          <MemberPhoto
            photo={photo}
            editing={true}
          />
        </>
      }
    />
  );
}
