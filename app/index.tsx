import { Redirect } from 'expo-router';

export default function Index() {
    // Redirect to login by default
    // In a real app, check auth state here
    return <Redirect href="/role-selection" />;
}
