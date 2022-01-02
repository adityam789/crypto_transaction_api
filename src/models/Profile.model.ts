import { Document, model, Schema } from "mongoose";

interface Profile extends Document {
    name: string,
    email: string,
    created_at: Date,
    updated_at: Date,
    email_verified: boolean,
    photo: string,
};

const ProfileSchema = new Schema<Profile>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: new Date(Date.now()),
    },
    updated_at: {
        type: Date,
        default: new Date(Date.now()),
    },
    email_verified: {
        type: Boolean,
        required: true,
    },
    photo: {
        type: String,
        required: false,
    },
});

const ProfileModel = model<Profile>("Profile", ProfileSchema);

export default ProfileModel;