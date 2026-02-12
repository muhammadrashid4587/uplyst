
-- Fix 1: Restrict waitlist_signups SELECT to only allow users to read their own signup by email
DROP POLICY "Users can read their own signup" ON public.waitlist_signups;
CREATE POLICY "Users can read their own signup"
ON public.waitlist_signups FOR SELECT
USING (false);

-- Fix 2: Fix conversations SELECT policy broken join condition
DROP POLICY "Users can view their conversations" ON public.conversations;
CREATE POLICY "Users can view their conversations"
ON public.conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_participants.conversation_id = conversations.id
    AND conversation_participants.user_id = auth.uid()
  )
);

-- Fix 3: Fix conversation_participants SELECT policy (also has self-referencing bug)
DROP POLICY "Users can view participants of their conversations" ON public.conversation_participants;
CREATE POLICY "Users can view participants of their conversations"
ON public.conversation_participants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);
