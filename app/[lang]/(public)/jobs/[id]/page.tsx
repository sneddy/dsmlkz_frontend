export default async function JobPage({ 
  params 
}: { 
  params: Promise<{ lang: string; id: string }> 
}) {
  const { lang, id } = await params
  // ...
}
