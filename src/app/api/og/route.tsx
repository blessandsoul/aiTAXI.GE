import { ImageResponse } from 'next/og';
import { ogFonts } from '@/features/blog/lib/georgian-font';

export const runtime = 'nodejs';

// Branded OG / cover generator. Shared by blog covers (no fetched photo) and any
// ?title= share card. Visual matches the service OG cards (createServiceOgImage)
// so the whole site speaks one design language. Params: ?title= &date= &tags=
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const title = (searchParams.get('title')?.slice(0, 120) || 'aiTAXI').trim();
        const date = searchParams.get('date') || '';
        const tags = (searchParams.get('tags')?.split(',').map(t => t.trim()).filter(Boolean)) || [];
        const eyebrow = (tags[0] || 'aiTAXI Insights').toUpperCase();
        const footerBadges = tags.slice(1, 4);

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        backgroundColor: '#08080d',
                        backgroundImage: 'linear-gradient(135deg, #0a0a14 0%, #0f0820 50%, #051218 100%)',
                        padding: '72px',
                        position: 'relative',
                        fontFamily: '"Noto Sans Georgian", sans-serif',
                    }}
                >
                    {/* Ambient orbs */}
                    <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,196,0,0.32) 0%, rgba(0,0,0,0) 65%)', filter: 'blur(40px)', display: 'flex' }} />
                    <div style={{ position: 'absolute', bottom: '-15%', left: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,143,0,0.25) 0%, rgba(0,0,0,0) 65%)', filter: 'blur(40px)', display: 'flex' }} />

                    {/* Top row: brand pill */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', zIndex: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', background: 'rgba(255,255,255,0.04)' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffc400', display: 'flex' }} />
                            <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', fontWeight: 600, letterSpacing: '0.08em' }}>aiTAXI.ge</span>
                        </div>
                    </div>

                    {/* Title block */}
                    <div style={{ display: 'flex', flexDirection: 'column', zIndex: 10, maxWidth: '1000px' }}>
                        <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '20px' }}>
                            {eyebrow}
                        </span>
                        <h1 style={{ fontSize: '72px', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.02em', margin: 0, backgroundImage: 'linear-gradient(120deg, #ffffff 0%, #ffe9a8 50%, #ffd54f 100%)', backgroundClip: 'text', color: 'transparent' }}>
                            {title}
                        </h1>
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                        {footerBadges.length > 0 ? (
                            <div style={{ display: 'flex', gap: '24px', fontSize: '20px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.06em' }}>
                                {footerBadges.map((b, i) => (
                                    <span key={i} style={{ display: 'flex' }}>{i > 0 ? `· ${b}` : b}</span>
                                ))}
                            </div>
                        ) : (
                            <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.06em' }}>
                                Robotaxi Fleet Management · Tbilisi, Georgia
                            </span>
                        )}
                        <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
                            {date || 'aitaxi.ge'}
                        </span>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: ogFonts,
            },
        );
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'unknown error';
        console.log(`OG render failed: ${message}`);
        return new Response('Failed to generate the image', { status: 500 });
    }
}
