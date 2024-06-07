import connectDB from "@/mongodb/db";
import { ICommentBase } from "@/mongodb/models/comment";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import exp from "constants";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  await connectDB();

  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comments = await post.getAllComments();

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { error: `Error occured while fetching comments ${error}` },
      { status: 500 }
    );
  }
}

export interface AddCommentRequestBody {
  user: IUser;
  text: string;
}

export async function POST(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  const { user, text }: AddCommentRequestBody = await request.json();

  await connectDB();

  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment: ICommentBase = { user, text };

    await post.commentOnPost(comment);
    return NextResponse.json({ message: "Comment added successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: `Error occured while adding comment ${error}` },
      { status: 500 }
    );
  }
}