import { useEffect, useState, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    user_email?: string; // We'll fetch this or join it
}

interface ChatViewProps {
    workspaceId: string;
}

export function ChatView({ workspaceId }: ChatViewProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id || null);

            // Fetch messages for this workspace
            const { data, error } = await (supabase as any)
                .from('messages')
                .select('*')
                .eq('workspace_id', workspaceId)
                .order('created_at', { ascending: true })
                .limit(50);

            if (!error && data) {
                setMessages(data);
            }
            setLoading(false);
        };

        fetchMessages();

        // Realtime Subscription filtered by workspace_id
        // Note: Row Level Security will handle the security, 
        // but filtering here ensures we only get relevant events if policies are broader.
        const channel = supabase
            .channel(`chat-${workspaceId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `workspace_id=eq.${workspaceId}`
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    setMessages((prev) => [...prev, newMsg]);
                    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [workspaceId]);

    useEffect(() => {
        if (!loading) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !userId) return;

        setSending(true);
        try {
            const { error } = await (supabase as any)
                .from('messages')
                .insert({
                    content: newMessage,
                    user_id: userId,
                    workspace_id: workspaceId
                });

            if (error) throw error;
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-zinc-500" /></div>;

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-[#0a0a0a] rounded-xl border border-[#222] overflow-hidden">
            <div className="p-4 border-b border-[#222] bg-[#111]">
                <h3 className="font-semibold text-zinc-200">Team Chat</h3>
                <p className="text-xs text-zinc-500">General channel</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                    const isMe = msg.user_id === userId;
                    const showAvatar = idx === 0 || messages[idx - 1].user_id !== msg.user_id;

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                        >
                            {showAvatar ? (
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                    <User className="w-4 h-4 text-indigo-400" />
                                </div>
                            ) : (
                                <div className="w-8" />
                            )}

                            <div className={`max-w-[70%] text-sm p-3 rounded-2xl ${isMe
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-[#1a1a1a] text-zinc-200 rounded-tl-none border border-[#333]'
                                }`}>
                                {msg.content}
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-[#222] bg-[#111] flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg disabled:opacity-50 transition-colors"
                >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
            </form>
        </div>
    );
}
