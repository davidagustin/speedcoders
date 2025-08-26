import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, opponentId, problemId } = await request.json();

    // For now, return a placeholder response
    return NextResponse.json({
      battleId: `battle_${Date.now()}`,
      status: 'pending',
      message: 'Multiplayer battles are not yet implemented',
      participants: [userId, opponentId],
      problem: problemId
    });
  } catch (error) {
    console.error('Battle creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create battle' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Multiplayer battles are not yet implemented',
    status: 'coming_soon'
  });
}