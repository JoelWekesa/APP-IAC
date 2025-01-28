import { cookies } from "next/headers";
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from "next/server";

export async function GET() {

    const token = await uuidv4();
    const cookieStore = await cookies();
    cookieStore.set('sil-token', token, {
        httpOnly: true,
        path: '/',
    });

    return new NextResponse(JSON.stringify({ token }), {
        status: 200,
    });
}