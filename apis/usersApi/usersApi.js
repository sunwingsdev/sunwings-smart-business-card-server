const express = require("express");
const { ObjectId } = require("mongodb");

const usersApi = (usersCollection) => {
  const userRouter = express.Router();

  userRouter.get("/", async (req, res) => {
    const result = await usersCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.send(result);
  });

  userRouter.get("/:uid", async (req, res) => {
    const uid = req.params.uid;
    const query = { uid: uid };
    const result = await usersCollection.findOne(query);
    res.send(result);
  });

  userRouter.post("/", async (req, res) => {
    const userData = req.body;
    const newUser = {
      fatherName: "",
      motherName: "",
      designation: "",
      alternatePhone: "",
      email: userData.email,
      alternateEmail: "",
      presentAddress: userData.address || null,
      permanentAddress: "",
      theme: "theme1",
      qrCode: [
        {
          qrCode: "",
          bgColor: "",
          fbColor: "",
        },
      ],
      facebook: [],
      twitter: [],
      instagram: [],
      whatsapp: [],
      linkedin: [],
      youtube: [],
      tiktok: [],
      snapchat: [],
      personalWebsite: [],
      role: "user",
      ...userData,
    };
    const result = await usersCollection.insertOne(newUser);
    res.send(result);
  });

  userRouter.patch("/:uid/profile-image", async (req, res) => {
    const uid = req.params.uid;
    const { profileImage } = req.body;
    const filter = { uid: uid };
    const updateProfilePicture = {
      $set: {
        profileImage: profileImage,
      },
    };
    const result = await usersCollection.updateOne(
      filter,
      updateProfilePicture
    );
    res.send(result);
  });

  userRouter.patch("/:uid/profile-cover", async (req, res) => {
    const uid = req.params.uid;
    const { profileCover } = req.body;
    const filter = { uid: uid };
    const updateProfileCover = {
      $set: {
        profileCover: profileCover,
      },
    };
    const result = await usersCollection.updateOne(filter, updateProfileCover);
    res.send(result);
  });

  userRouter.patch("/:uid/about-me", async (req, res) => {
    const uid = req.params.uid;
    const { aboutMe } = req.body;
    const filter = { uid: uid };
    const updateAboutMe = {
      $set: {
        aboutMe: aboutMe,
      },
    };
    const result = await usersCollection.updateOne(filter, updateAboutMe);
    res.send(result);
  });

  userRouter.patch("/:uid/qr-code", async (req, res) => {
    const uid = req.params.uid;
    const { qrCode, bgColor, fgColor } = req.body;
    const filter = { uid: uid };
    const updateQrCode = {
      $set: {
        qrCode: {
          qrCode: qrCode,
          bgColor: bgColor,
          fgColor: fgColor,
        },
      },
    };
    const result = await usersCollection.updateOne(filter, updateQrCode);
    res.send(result);
  });

  userRouter.put("/:uid/basic-info", async (req, res) => {
    const uid = req.params.uid;
    const updateBasicInfo = req.body;
    const filter = { uid: uid };
    const options = { upsert: true };
    const newBasicInfo = {
      $set: {
        name: updateBasicInfo.name,
        fatherName: updateBasicInfo.fatherName,
        motherName: updateBasicInfo.motherName,
        designation: updateBasicInfo.designation,
        phone: updateBasicInfo.phone,
        alternatePhone: updateBasicInfo.alternatePhone,
        email: updateBasicInfo.email,
        alternateEmail: updateBasicInfo.alternateEmail,
        dob: updateBasicInfo.dob,
        presentAddress: updateBasicInfo.presentAddress,
        permanentAddress: updateBasicInfo.permanentAddress,
        preferedLanguage: updateBasicInfo.preferedLanguage,
      },
    };
    const result = await usersCollection.updateOne(
      filter,
      newBasicInfo,
      options
    );
    res.send(result);
  });

  userRouter.get("/:uid/education-info", async (req, res) => {
    const uid = req.params.uid;
    const pipeline = [
      {
        $match: { uid: uid },
      },
      {
        $lookup: {
          from: "education",
          localField: "uid",
          foreignField: "uid",
          as: "educationData",
        },
      },
    ];
    const result = await usersCollection.aggregate(pipeline).toArray();
    res.send(result);
  });

  userRouter.patch("/:uid/theme", async (req, res) => {
    const uid = req.params.uid;
    const { theme } = req.body;
    const filter = { uid: uid };
    const updateQrCode = {
      $set: {
        theme: theme,
      },
    };
    const result = await usersCollection.updateOne(filter, updateQrCode);
    res.send(result);
  });

  userRouter.patch("/:uid/role", async (req, res) => {
    const uid = req.params.uid;
    const { role } = req.body;
    const filter = { _id: new ObjectId(uid) };
    const updateQrCode = {
      $set: {
        role: role,
      },
    };
    const result = await usersCollection.updateOne(filter, updateQrCode);
    res.send(result);
  });

  return userRouter;
};

module.exports = usersApi;
