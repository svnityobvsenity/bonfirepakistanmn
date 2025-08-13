'use client';

import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function DMsPage() {
  return (
    <div
      className={`dms-root ${inter.className}`}
      style={{
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif",
        background: '#000000',
        color: '#ffffff',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '1049px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: '236px',
            background: '#000000',
            borderRight: '1px solid #1A1A1A',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <div
            style={{
              padding: '15px',
              borderBottom: '1px solid #1A1A1A',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#FFFFFF',
                fontSize: '9.1px',
                fontWeight: 600,
                marginBottom: '10px',
              }}
            >
              📌 Pinned Messages
            </div>
            <div
              style={{
                background: 'linear-gradient(90deg, #202020 0%, #090909 100%)',
                border: '1px solid #0C0C0C',
                borderRadius: '6px',
                padding: '8px 12px',
                marginBottom: '10px',
              }}
            >
              <input
                type="text"
                placeholder="Inbox"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#BDBDBD',
                  fontSize: '9.3px',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>
            <div
              style={{
                background: 'linear-gradient(90deg, #202020 0%, #090909 100%)',
                border: '1px solid #111111',
                borderRadius: '6px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                color: '#696969',
                fontSize: '9.5px',
              }}
            >
              👥 Friends
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '15px 0',
            }}
          >
            {/* Selected user */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 15px',
                cursor: 'pointer',
                transition: 'background 0.2s',
                background: 'linear-gradient(90deg, #202020 0%, #090909 100%)',
                borderRadius: '6px',
                margin: '0 10px',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#333',
                  marginRight: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#fff',
                }}
              >
                D
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '11.5px',
                    color: '#FFFFFF',
                    marginBottom: '2px',
                  }}
                >
                  daFoxy
                </div>
                <div
                  style={{
                    fontSize: '7px',
                    color: '#333333',
                  }}
                >
                  Playing Blender
                </div>
              </div>
            </div>

            {/* Others */}
            {[
              { a: 'J', n: 'james', s: 'Playing Procrast' },
              { a: 'E', n: 'Ekmand' },
              { a: 'S', n: 'Sticks' },
              { a: 'F', n: 'FranzaGeek', s: 'Playing Powerpoi' },
              { a: 'M', n: "Markella's", s: 'Playing MTG Aren' },
              { a: 'A', n: 'AY-Plays' },
              { a: 'L', n: 'LemonTiger' },
              { a: 'N', n: 'NRD' },
            ].map((u, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 15px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#333',
                    marginRight: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#fff',
                  }}
                >
                  {u.a}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '11.5px',
                      color: '#FFFFFF',
                      marginBottom: '2px',
                    }}
                  >
                    {u.n}
                  </div>
                  {u.s ? (
                    <div
                      style={{
                        fontSize: '7px',
                        color: '#333333',
                      }}
                    >
                      {u.s}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: '12px 15px',
              color: '#FFFFFF',
              fontSize: '9.4px',
              fontWeight: 400,
              borderTop: '1px solid #1A1A1A',
            }}
          >
            📧 Direct Messages
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: '#000000',
          }}
        >
          <div
            style={{
              height: '79px',
              background:
                'linear-gradient(93.68deg, #000000 16.57%, #2F2F2F 156.41%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              {Array.from({ length: 14 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '22px',
                    background: '#333',
                  }}
                />
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(3.25px)',
                borderRadius: '11px 27px 27px 11px',
                padding: '8px',
                boxShadow: 'inset 0px 0px 15.8px #181818',
              }}
            >
              <div style={{ marginRight: '12px' }}>
                <div
                  style={{
                    fontSize: '8px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                  }}
                >
                  Kaif
                </div>
                <div
                  style={{
                    fontSize: '4px',
                    color: '#6B6B6B',
                  }}
                >
                  Kaif#001
                </div>
              </div>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#333',
                }}
              />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: 'rgba(0, 0, 0, 0.996078)',
              borderRadius: '141px 99px 64px 151px',
              margin: '8px 11px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
              }}
            >
              {[
                {
                  a: 'D',
                  n: 'daFoxy',
                  t: 'Today at 9:41PM',
                  m: 'I saw this really cool Discord clone tutorial',
                },
                {
                  a: 'S',
                  n: 'Concept Central',
                  t: 'Today at 9:41PM',
                  m: 'Sure thing! Want to collaborate on it?',
                },
                {
                  a: 'D',
                  n: 'daFoxy',
                  t: 'Today at 9:41PM',
                  m: "oOoOOoo what's the tech stack?",
                },
                {
                  a: 'S',
                  n: 'Concept Central',
                  t: 'Today at 9:41PM',
                  m: "It's this new Discord interface design I found",
                },
                {
                  a: 'D',
                  n: 'daFoxy',
                  t: 'Today at 9:41PM',
                  m: 'No, how does it work?',
                },
                {
                  a: 'S',
                  n: 'Concept Central',
                  t: 'Today at 9:44 PM',
                  m:
                    "Just paste a YouTube link and it'll automatically embed the video with a nice preview",
                },
                {
                  a: 'D',
                  n: 'daFoxy',
                  t: 'Today at 9:41PM',
                  m: "Woah! I'll start working on the frontend",
                },
                {
                  a: 'S',
                  n: 'Concept Central',
                  t: 'Today at 9:44 PM',
                  m: "Cool, can't wait to see what you build!",
                },
                {
                  a: 'D',
                  n: 'daFoxy',
                  t: 'Today at 9:41PM',
                  m: 'Awesome, starting now!',
                },
                {
                  a: 'C',
                  n: 'Concept Central',
                  t: 'Today at 9:44 PM',
                  m: 'Joined.',
                },
              ].map((msg, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}
                >
                  <div
                    style={{
                      width: '25px',
                      height: '25px',
                      borderRadius: '50%',
                      background: '#333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    {msg.a}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '2px',
                      }}
                    >
                      <span
                        style={{ fontSize: '8.3px', fontWeight: 400, color: '#FFFFFF' }}
                      >
                        {msg.n}
                      </span>
                      <span style={{ fontSize: '7px', color: '#4E4E4E' }}>{msg.t}</span>
                    </div>
                    <div
                      style={{
                        fontSize: '7.6px',
                        color: '#FFFFFF',
                        lineHeight: '1.2',
                      }}
                    >
                      {msg.m}
                    </div>
                  </div>
                </div>
              ))}

              <div
                style={{ height: '3px', background: '#040404', margin: '10px 0' }}
              />

              <div
                style={{
                  padding: '15px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderTop: '1px solid #1A1A1A',
                }}
              >
                <div
                  style={{
                    width: '25px',
                    height: '25px',
                    borderRadius: '50%',
                    background: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#fff',
                  }}
                >
                  D
                </div>
                <div
                  style={{ fontSize: '15px', fontWeight: 700, color: '#959595' }}
                >
                  daFoxy
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(90deg, #090909 0%, #202020 100%)',
                borderRadius: '4px 7px 4px 4px',
                margin: '7px 11px',
                padding: '8px 15px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{ width: '17px', height: '17px', background: '#444', borderRadius: '3px' }}
              />
              <div
                style={{ width: '17px', height: '17px', background: '#444', borderRadius: '3px' }}
              />
              <input
                type="text"
                placeholder="Message daFoxy"
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: '#383838',
                  fontSize: '9.4px',
                  outline: 'none',
                }}
              />
              <div
                style={{ width: '17px', height: '17px', background: '#444', borderRadius: '3px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


