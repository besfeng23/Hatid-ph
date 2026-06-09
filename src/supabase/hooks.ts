
'use client';

import { useState, useEffect, useContext } from 'react';
import { SupabaseContext } from './context';
import { User } from '@supabase/supabase-js';

export function useSupabaseUser() {
    const { supabase } = useContext(SupabaseContext);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setIsLoading(false);
        };

        getUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase]);

    return { user, isLoading };
}
