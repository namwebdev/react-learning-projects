"use client";

import { Image } from "@nextui-org/react";
import { Photo } from "@prisma/client";
import clsx from "clsx";
import { CldImage } from "next-cloudinary";
import { useState } from "react";
import {
  AiFillDelete,
  AiFillStar,
  AiOutlineDelete,
  AiOutlineStar,
} from "react-icons/ai";
import { PiSpinnerGap } from "react-icons/pi";

type PhotoProp = {
  photo: Photo | null;
};
type Props = {
  editing?: boolean;
} & PhotoProp;

export default function MemberPhoto({ photo, editing }: Props) {
  const [loading, setLoading] = useState({
    type: "",
    isLoading: false,
    id: "",
  });

  return (
    <div className="grid grid-cols-5 gap-3 p-5">
      {photo && (
        <div className="relative">
          <MemberImage photo={photo} />

          {editing && (
            <>
              <div
                // onClick={() => onSetMain(photo)}
                className="absolute top-3 left-3 z-50"
              >
                <StarButton
                  loading={
                    loading.isLoading &&
                    loading.type === "main" &&
                    loading.id === photo.id
                  }
                />
              </div>

              <div
                // onClick={() => onDelete(photo)}
                className="absolute top-3 right-3 z-50"
              >
                <DeleteButton
                  loading={
                    loading.isLoading &&
                    loading.type === "delete" &&
                    loading.id === photo.id
                  }
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MemberImage({ photo }: PhotoProp) {
  if (!photo) return null;

  return (
    <div>
      {photo?.publicId ? (
        <CldImage
          alt="Image of member"
          src={photo.publicId}
          width={300}
          height={300}
          crop="fill"
          gravity="faces"
          className={clsx("rounded-2xl opacity-40")}
          priority
        />
      ) : (
        <Image src={photo.url || "/images/user.png"} alt="Image of user" />
      )}
    </div>
  );
}

function StarButton({
  selected,
  loading,
}: {
  selected?: boolean;
  loading: boolean;
}) {
  return (
    <div className="relative hover:opacity-80 transition cursor-pointer">
      {!loading ? (
        <>
          <AiOutlineStar
            size={32}
            className="fill-white absolute -top-[2px] -right-[2px]"
          />
          <AiFillStar
            size={28}
            className={selected ? "fill-yellow-200" : "fill-neutral-500/70"}
          />
        </>
      ) : (
        <PiSpinnerGap size={32} className="fill-white animate-spin" />
      )}
    </div>
  );
}

function DeleteButton({ loading }: { loading: boolean }) {
  return (
    <div className="relative hover:opacity-80 transition cursor-pointer">
      {!loading ? (
        <>
          <AiOutlineDelete
            size={32}
            className="fill-white absolute -top-[2px] -right-[2px]"
          />
          <AiFillDelete size={28} className="fill-red-600" />
        </>
      ) : (
        <PiSpinnerGap size={32} className="fill-white animate-spin" />
      )}
    </div>
  );
}
