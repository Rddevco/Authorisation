// import vine, { errors } from "@vinejs/vine";
// import { NextRequest, NextResponse } from "next/server";
// import ErrorReporter from "@/validator/ErrorReporter";
// import { loginSchema } from "@/validator/authValidationSchema";
// import { User } from "@/models/User";
// import bcrypt from "bcryptjs";
// import { connect } from "@/database/mongo.config";
// // import { signIn } from "next-auth/react"; 


// // * Connect to the DB

// connect();

// export default async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     vine.errorReporter = () => new ErrorReporter();
//     const validator = vine.compile(loginSchema);
//     const output = await validator.validate(body);
//     const user = await User.findOne({ email: output.email });
//     if (user) {
//       const checkPassword = bcrypt.compareSync(output.password!, user.password);
//       console.info("the checkpassword is", checkPassword);
//       if (checkPassword) {
//         return NextResponse.json(
//           { status: 200, message: "User Logged in successfully!" },
//           { status: 200 }
//         );
//       }
//       return NextResponse.json(
//         {
//           status: 400,
//           errors: {
//             email: "Please check your credentials.",
//           },
//         },
//         { status: 200 }
//       );
//     } else {
//       return NextResponse.json(
//         {
//           status: 400,
//           errors: {
//             email: "No User found in our system with above email.",
//           },
//         },
//         { status: 200 }
//       );
//     }
//   } catch (error) {
//     if (error instanceof errors.E_VALIDATION_ERROR) {
//       return NextResponse.json(
//         { status: 400, errors: error.messages },
//         { status: 200 }
//       );
//     }
//   }
// }

import vine, { errors } from "@vinejs/vine";
import { NextRequest, NextResponse } from "next/server";
import ErrorReporter from "@/validator/ErrorReporter";
import { loginSchema } from "@/validator/authValidationSchema";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { connect } from "@/database/mongo.config";
import { signIn } from "next-auth/react";

// Connect to the database
connect();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    vine.errorReporter = () => new ErrorReporter();
    const validator = vine.compile(loginSchema);
    const output = await validator.validate(body);

    const user = await User.findOne({ email: output.email });
    if (user) {
      const checkPassword = bcrypt.compareSync(output.password!, user.password);
      if (checkPassword) {
        return NextResponse.json(
          { status: 200, message: "User Logged in successfully!" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          status: 400,
          errors: { email: "Please check your credentials." },
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          status: 400,
          errors: { email: "No user found in our system with the provided email." },
        },
        { status: 400 }
      );
    }
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json(
        { status: 400, errors: error.messages },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { status: 500, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

