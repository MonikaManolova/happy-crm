import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { CURRENT_OPERATOR, REPLY_TYPES, type Signal, type SignalReply } from '../../data/signals';
import { Button } from '../ds/Button';
import { Select } from '../ds/Dropdown';
import { Icon } from '../ds/Icon';
import { Textarea } from '../ds/Textarea';
import { Collapse } from '../order/Collapse';

const meta: CSSProperties = { fontWeight: 400, fontSize: 14, lineHeight: '20px', color: 'var(--grey-600)', whiteSpace: 'nowrap' };

/** Icon tile, title, "author • time" and an optional message: one entry of the card. */
function Entry({ icon, iconColor, tileColor, title, author, time, message, children }: {
  icon: string;
  iconColor: string;
  tileColor: string;
  title: string;
  author: string;
  time: string;
  message?: string;
  children?: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2-5)' }}>
      <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 5.818, background: tileColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon icon={icon} size={18} color={iconColor} />
      </div>
      <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: 'var(--grey-900)' }}>{title}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2px 4px' }}>
            <span style={meta}>{author}</span>
            <span aria-hidden="true" style={{ fontSize: 12, lineHeight: '16px', color: 'var(--grey-400)' }}>
              •
            </span>
            <span style={meta}>{time}</span>
          </div>
        </div>
        {message ? (
          <div style={{ borderRadius: 'var(--rounded-lg)', background: 'var(--grey-100)', padding: '6px 8px', fontSize: 14, lineHeight: '20px', color: 'var(--grey-600)' }}>
            Съобщение: <span style={{ fontWeight: 500, color: 'var(--grey-900)' }}>{message}</span>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

/** Expand/collapse duration of the card's sections, matching the order panel's accordions. */
const EXPAND_MS = 240;

// Below the signal, separated by a hairline. Figma draws the 1px stroke inside: 1px + 8px = its 9px top padding.
const section: CSSProperties = { borderTop: '1px solid var(--grey-200)', padding: '8px 12px 8px 8px' };

/**
 * A courier signal (Figma 1093:75893) in three states: open with "Добави отговор",
 * the reply form, and answered with the operator's reply below.
 */
export function SignalCard({ signal, onReply }: { signal: Signal; onReply: (reply: SignalReply) => void }) {
  const [replying, setReplying] = useState(false);
  const [type, setType] = useState(REPLY_TYPES[0]);
  const [text, setText] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  // Once the form has finished expanding, let the select's menu overflow it.
  const [formSettled, setFormSettled] = useState(false);
  // A new reply mounts collapsed and expands on the next frame.
  const [replyShown, setReplyShown] = useState(!!signal.reply);

  useEffect(() => {
    if (!replying) {
      setFormSettled(false);
      return undefined;
    }
    // Put the cursor in the textarea when the form opens.
    formRef.current?.querySelector('textarea')?.focus({ preventScroll: true });
    const t = setTimeout(() => setFormSettled(true), EXPAND_MS + 20);
    return () => clearTimeout(t);
  }, [replying]);

  useEffect(() => {
    if (!signal.reply || replyShown) return undefined;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReplyShown(true)));
    return () => cancelAnimationFrame(id);
  }, [signal.reply, replyShown]);

  const cancel = () => {
    setReplying(false);
    setText('');
  };
  const send = () => {
    const message = text.trim();
    if (!message) return;
    onReply({ type, author: CURRENT_OPERATOR, time: 'току-що', message });
    cancel();
  };

  return (
    <article
      aria-label={signal.reason}
      style={{
        alignSelf: 'stretch',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--white)',
        border: '1px solid var(--grey-200)',
        borderRadius: 'var(--rounded-lg)',
        boxShadow: 'var(--shadow-control)',
      }}
    >
      <div style={{ padding: '8px 12px 8px 8px' }}>
        <Entry
          icon="LucideTriangleAlert"
          iconColor="var(--warning-700)"
          tileColor="#FFEDD6"
          title={signal.reason}
          author={signal.author}
          time={signal.time}
          message={signal.message}
        >
          {/* The negative margin cancels the column gap, so a collapsed button leaves no space behind. */}
          <Collapse open={!signal.reply && !replying} duration={EXPAND_MS} fade style={{ marginTop: 'calc(-1 * var(--space-1-5))' }}>
            <div style={{ padding: 'calc(var(--space-1-5) + 4px) 0 4px', display: 'flex' }}>
              <Button type="solid" size="small" icon="LucidePlus" onClick={() => setReplying(true)}>
                Добави отговор
              </Button>
            </div>
          </Collapse>
        </Entry>
      </div>

      <Collapse open={replying} duration={EXPAND_MS} fade overflow={formSettled ? 'visible' : 'hidden'}>
        <div ref={formRef} style={{ ...section, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
          <Select size="medium" value={type} options={REPLY_TYPES} search={false} onSelect={setType} />
          <Textarea
            size="medium"
            placeholder="Въведи съобщение"
            aria-label="Отговор"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') cancel();
            }}
          />
          <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
            <Button type="outline" size="medium" onClick={cancel}>
              Отказ
            </Button>
            <Button type="solid" size="medium" disabled={!text.trim()} onClick={send}>
              Изпрати
            </Button>
          </div>
        </div>
      </Collapse>

      {signal.reply ? (
        <Collapse open={replyShown} duration={EXPAND_MS} fade>
          <div style={section}>
            <Entry
              icon="LucideHeadset"
              iconColor="var(--info-700)"
              tileColor="var(--info-50)"
              title={signal.reply.type}
              author={signal.reply.author}
              time={signal.reply.time}
              message={signal.reply.message}
            />
          </div>
        </Collapse>
      ) : null}
    </article>
  );
}
